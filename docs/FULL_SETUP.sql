-- ============================================================
-- SKILL NAVIGATOR — COMPLETE SUPABASE SETUP
-- Paste this ENTIRE file into Supabase SQL Editor and Run All
-- ============================================================

-- ============================================================
-- 0. Helper: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- 1. Profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  xp_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. Auto-create profile on signup (fixes login fetch error)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. Roadmaps table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  total_levels INTEGER NOT NULL DEFAULT 1,
  estimated_hours INTEGER,
  learner_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Roadmaps viewable by everyone" ON public.roadmaps;
CREATE POLICY "Roadmaps viewable by everyone" ON public.roadmaps FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_roadmaps_updated_at ON public.roadmaps;
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. Roadmap levels
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roadmap_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Levels viewable by everyone" ON public.roadmap_levels;
CREATE POLICY "Levels viewable by everyone" ON public.roadmap_levels FOR SELECT USING (true);
CREATE UNIQUE INDEX IF NOT EXISTS idx_roadmap_level_unique ON public.roadmap_levels(roadmap_id, level_number);

-- ============================================================
-- 5. Level topics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.level_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id UUID NOT NULL REFERENCES public.roadmap_levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  resource_url TEXT,
  resource_type TEXT CHECK (resource_type IN ('video', 'article', 'docs', 'exercise', 'project')),
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.level_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Topics viewable by everyone" ON public.level_topics;
CREATE POLICY "Topics viewable by everyone" ON public.level_topics FOR SELECT USING (true);

-- ============================================================
-- 6. User roadmap enrollments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1,
  progress_percent NUMERIC NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, roadmap_id)
);

ALTER TABLE public.user_roadmaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.user_roadmaps;
DROP POLICY IF EXISTS "Users can enroll" ON public.user_roadmaps;
DROP POLICY IF EXISTS "Users can update own enrollments" ON public.user_roadmaps;
CREATE POLICY "Users can view own enrollments" ON public.user_roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll" ON public.user_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.user_roadmaps FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- 7. User topic completions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_topic_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.level_topics(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.user_topic_completions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own completions" ON public.user_topic_completions;
DROP POLICY IF EXISTS "Users can mark complete" ON public.user_topic_completions;
CREATE POLICY "Users can view own completions" ON public.user_topic_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark complete" ON public.user_topic_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 8. Daily tasks (old schema — kept for compatibility)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  task_type TEXT CHECK (task_type IN ('quiz', 'coding', 'reading', 'project')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tasks viewable by everyone" ON public.daily_tasks;
CREATE POLICY "Tasks viewable by everyone" ON public.daily_tasks FOR SELECT USING (true);

-- ============================================================
-- 9. User daily task completions (old schema)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.daily_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id)
);

ALTER TABLE public.user_daily_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own task completions" ON public.user_daily_tasks;
DROP POLICY IF EXISTS "Users can complete tasks" ON public.user_daily_tasks;
CREATE POLICY "Users can view own task completions" ON public.user_daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can complete tasks" ON public.user_daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 10. Badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_required INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Badges viewable by everyone" ON public.badges;
CREATE POLICY "Badges viewable by everyone" ON public.badges FOR SELECT USING (true);

-- ============================================================
-- 11. User badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User badges viewable by everyone" ON public.user_badges;
DROP POLICY IF EXISTS "Users can earn badges" ON public.user_badges;
CREATE POLICY "User badges viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can earn badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 12. Questions table (new — replaces Spring Boot generator)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  starter_code TEXT,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Questions viewable by everyone" ON public.questions;
CREATE POLICY "Questions viewable by everyone" ON public.questions FOR SELECT USING (true);

-- ============================================================
-- 13. Daily completions table (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id, completed_date)
);

ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own completions" ON public.daily_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON public.daily_completions;
CREATE POLICY "Users can view own completions" ON public.daily_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON public.daily_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 14. RPC: add_xp — increment XP + recalculate level + streak
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS TABLE(xp_points INTEGER, level INTEGER, streak_days INTEGER) AS $$
DECLARE
  today DATE := CURRENT_DATE;
  last_date DATE;
  new_xp INTEGER;
  new_level INTEGER;
  new_streak INTEGER;
BEGIN
  SELECT p.last_active_date, p.streak_days
  INTO last_date, new_streak
  FROM public.profiles p WHERE p.user_id = user_uuid;

  -- Update streak logic
  IF last_date IS NULL THEN
    new_streak := 1;
  ELSIF last_date = today - INTERVAL '1 day' THEN
    new_streak := new_streak + 1;
  ELSIF last_date = today THEN
    new_streak := new_streak; -- already active today
  ELSE
    new_streak := 1; -- streak broken
  END IF;

  UPDATE public.profiles
  SET
    xp_points = profiles.xp_points + xp_amount,
    level = GREATEST(1, FLOOR((profiles.xp_points + xp_amount) / 100) + 1)::INTEGER,
    streak_days = new_streak,
    last_active_date = today,
    updated_at = now()
  WHERE profiles.user_id = user_uuid
  RETURNING profiles.xp_points, profiles.level, profiles.streak_days
  INTO new_xp, new_level, new_streak;

  RETURN QUERY SELECT new_xp, new_level, new_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 15. RPC: get_daily_questions — fetch 2 random questions
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_daily_questions(
  p_language TEXT,
  p_difficulty TEXT
)
RETURNS SETOF public.questions AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM public.questions
    WHERE LOWER(language) = LOWER(p_language)
      AND LOWER(difficulty) = LOWER(p_difficulty)
    ORDER BY RANDOM()
    LIMIT 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 16. Seed questions (safe — uses ON CONFLICT DO NOTHING)
-- ============================================================

-- PYTHON EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Reverse a String','Write a Python function to reverse a string without using slicing.','def reverse_string(s: str) -> str:\n    # Your code here\n    pass','Python','easy',10),
('Find Maximum','Write a Python function to find the maximum element in a list.','def find_max(lst: list) -> int:\n    # Your code here\n    pass','Python','easy',10),
('Check Palindrome','Write a Python function to check if a string is a palindrome (case-insensitive).','def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass','Python','easy',10),
('Count Vowels','Count the number of vowels in a given string.','def count_vowels(s: str) -> int:\n    # Your code here\n    pass','Python','easy',10),
('FizzBuzz','Print 1-100 replacing multiples of 3 with Fizz, 5 with Buzz, both with FizzBuzz.','def fizzbuzz() -> None:\n    # Your code here\n    pass','Python','easy',10),
('Remove Duplicates','Remove duplicates from a list while preserving insertion order.','def remove_duplicates(lst: list) -> list:\n    # Your code here\n    pass','Python','easy',10),
('Fibonacci Sequence','Return the first n Fibonacci numbers as a list.','def fibonacci(n: int) -> list:\n    # Your code here\n    pass','Python','easy',10),
('Filter Even Numbers','Filter all even numbers from a list using list comprehension.','def filter_evens(lst: list) -> list:\n    # Your code here\n    pass','Python','easy',10)
ON CONFLICT DO NOTHING;

-- PYTHON MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Two Sum','Find two numbers in a list that add up to target. Return their indices.','def two_sum(nums: list, target: int) -> list:\n    # Your code here\n    pass','Python','medium',20),
('Implement Stack','Create a Stack class with push, pop, peek, and is_empty methods.','class Stack:\n    def __init__(self): pass\n    def push(self, item): pass\n    def pop(self): pass\n    def peek(self): pass\n    def is_empty(self) -> bool: pass','Python','medium',20),
('Binary Search','Implement binary search on a sorted list. Return index or -1.','def binary_search(arr: list, target: int) -> int:\n    # Your code here\n    pass','Python','medium',20),
('Merge Sorted Arrays','Merge two sorted arrays into one sorted array efficiently.','def merge_sorted(arr1: list, arr2: list) -> list:\n    # Your code here\n    pass','Python','medium',20),
('Anagram Check','Check if two strings are anagrams (ignore spaces and case).','def is_anagram(s1: str, s2: str) -> bool:\n    # Your code here\n    pass','Python','medium',20),
('Group Anagrams','Group words that are anagrams together from a list.','def group_anagrams(words: list) -> list:\n    # Your code here\n    pass','Python','medium',20)
ON CONFLICT DO NOTHING;

-- PYTHON HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('LRU Cache','Implement an LRU Cache with O(1) get and put operations.','class LRUCache:\n    def __init__(self, capacity: int): pass\n    def get(self, key: int) -> int: pass\n    def put(self, key: int, value: int) -> None: pass','Python','hard',35),
('Trie Implementation','Implement a Trie with insert, search, and startsWith methods.','class Trie:\n    def __init__(self): pass\n    def insert(self, word: str) -> None: pass\n    def search(self, word: str) -> bool: pass\n    def startsWith(self, prefix: str) -> bool: pass','Python','hard',35),
('Graph BFS & DFS','Implement both BFS and DFS for an adjacency list graph.','def bfs(graph: dict, start: str) -> list:\n    pass\ndef dfs(graph: dict, start: str) -> list:\n    pass','Python','hard',35),
('Longest Palindromic Substring','Find the longest palindromic substring using dynamic programming.','def longest_palindrome(s: str) -> str:\n    # Your code here\n    pass','Python','hard',35)
ON CONFLICT DO NOTHING;

-- JAVASCRIPT EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Array Sum','Sum all numbers in an array without using reduce().','function sumArray(arr) {\n    // Your code here\n}','JavaScript','easy',10),
('String Reversal','Reverse a string without using built-in reverse().','function reverseString(str) {\n    // Your code here\n}','JavaScript','easy',10),
('Filter Even Numbers JS','Filter even numbers from an array using a loop.','function filterEven(arr) {\n    // Your code here\n}','JavaScript','easy',10),
('Capitalize Words','Capitalize the first letter of every word in a sentence.','function capitalizeWords(sentence) {\n    // Your code here\n}','JavaScript','easy',10),
('Count Occurrences','Count how many times each element appears in an array.','function countOccurrences(arr) {\n    // Returns { element: count }\n}','JavaScript','easy',10),
('Remove Falsy Values','Remove all falsy values from an array.','function removeFalsy(arr) {\n    // Your code here\n}','JavaScript','easy',10)
ON CONFLICT DO NOTHING;

-- JAVASCRIPT MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Debounce Function','Implement a debounce function that delays execution.','function debounce(func, delay) {\n    // Your code here\n}','JavaScript','medium',20),
('Deep Clone','Deep clone a JavaScript object handling nested objects and arrays.','function deepClone(obj) {\n    // Your code here\n}','JavaScript','medium',20),
('Memoize Function','Write a memoize higher-order function that caches results.','function memoize(fn) {\n    // Your code here\n}','JavaScript','medium',20),
('Curry Function','Implement function currying for any number of arguments.','function curry(fn) {\n    // Your code here\n}','JavaScript','medium',20)
ON CONFLICT DO NOTHING;

-- JAVASCRIPT HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Event Emitter','Create an EventEmitter class with on, off, once, and emit methods.','class EventEmitter {\n    on(event, listener) {}\n    off(event, listener) {}\n    once(event, listener) {}\n    emit(event, ...args) {}\n}','JavaScript','hard',35),
('LRU Cache JS','Implement an LRU Cache with O(1) get/put using Map.','class LRUCache {\n    constructor(capacity) {}\n    get(key) {}\n    put(key, value) {}\n}','JavaScript','hard',35)
ON CONFLICT DO NOTHING;

-- JAVA EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Reverse Array','Reverse an integer array in-place without extra space.','public static void reverseArray(int[] arr) {\n    // Your code here\n}','Java','easy',10),
('String Palindrome','Check if a string is a palindrome ignoring case and spaces.','public static boolean isPalindrome(String s) {\n    // Your code here\n}','Java','easy',10),
('Second Largest','Find the second largest element in an array.','public static int secondLargest(int[] arr) {\n    // Your code here\n}','Java','easy',10),
('Fibonacci Iterative','Generate first N Fibonacci numbers iteratively.','public static int[] fibonacci(int n) {\n    // Your code here\n}','Java','easy',10)
ON CONFLICT DO NOTHING;

-- JAVA MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Singleton Pattern','Implement thread-safe Singleton using double-checked locking.','public class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        // Your code here\n    }\n}','Java','medium',20),
('Stack with Min','Design a stack supporting push, pop, and getMin in O(1).','class MinStack {\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}','Java','medium',20),
('Custom HashMap','Build a HashMap with put, get, remove using arrays.','class MyHashMap {\n    public void put(int key, int value) {}\n    public int get(int key) { return -1; }\n    public void remove(int key) {}\n}','Java','medium',20)
ON CONFLICT DO NOTHING;

-- JAVA HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Binary Search Tree','Implement BST with insert, search, delete, inorder traversal.','class BST {\n    class Node { int val; Node left, right; }\n    Node root;\n    public void insert(int val) {}\n    public boolean search(int val) { return false; }\n    public List<Integer> inorder() { return null; }\n}','Java','hard',35),
('LRU Cache Java','Implement LRU Cache using LinkedHashMap or doubly linked list.','class LRUCache {\n    private final int capacity;\n    LRUCache(int capacity) { this.capacity = capacity; }\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}','Java','hard',35)
ON CONFLICT DO NOTHING;

-- C++ EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Bubble Sort','Implement optimized bubble sort.','void bubbleSort(vector<int>& arr) {\n    // Your code here\n}','C++','easy',10),
('Prime Check','Check if a number is prime efficiently.','bool isPrime(int n) {\n    // Your code here\n}','C++','easy',10),
('Count Digits','Count the number of digits in an integer.','int countDigits(int n) {\n    // Your code here\n}','C++','easy',10)
ON CONFLICT DO NOTHING;

-- C++ MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Implement Queue Using Stacks','Implement a queue using two stacks.','class MyQueue {\n    stack<int> s1, s2;\npublic:\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return true; }\n};','C++','medium',20),
('Smart Pointer','Create a simple unique_ptr implementation.','template<typename T>\nclass UniquePtr {\n    T* ptr;\npublic:\n    explicit UniquePtr(T* p) : ptr(p) {}\n    ~UniquePtr() { delete ptr; }\n    T& operator*() { return *ptr; }\n};','C++','medium',20)
ON CONFLICT DO NOTHING;

-- C++ HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Vector Implementation','Build a dynamic array with push_back, resize.','template<typename T>\nclass Vector {\n    T* data; size_t sz, cap;\npublic:\n    Vector() : data(nullptr), sz(0), cap(0) {}\n    void push_back(const T& val) {}\n    T& operator[](size_t i) { return data[i]; }\n    size_t size() const { return sz; }\n};','C++','hard',35)
ON CONFLICT DO NOTHING;

-- DSA EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Two Sum DSA','Given an array and target, find two indices whose values sum to target using O(n).','# nums = [2, 7, 11, 15], target = 9 → [0, 1]\ndef two_sum(nums: list, target: int) -> list:\n    # Use a hash map\n    pass','DSA','easy',10),
('Valid Parentheses','Check if a string of brackets is valid using a stack.','# ({[]}) → True, ([)] → False\ndef is_valid(s: str) -> bool:\n    # Use a stack\n    pass','DSA','easy',10),
('Maximum Subarray','Find the subarray with the largest sum using Kadane''s algorithm.','# [-2,1,-3,4,-1,2,1,-5,4] → 6\ndef max_subarray(nums: list) -> int:\n    # Kadane''s algorithm O(n)\n    pass','DSA','easy',10),
('Binary Search DSA','Implement binary search on a sorted array in O(log n).','# arr=[1,3,5,7,9], target=7 → index 3\ndef binary_search(arr: list, target: int) -> int:\n    pass','DSA','easy',10),
('Climbing Stairs','Count ways to climb n stairs taking 1 or 2 steps (DP).','# n=3 → 3 ways\ndef climb_stairs(n: int) -> int:\n    # Dynamic programming\n    pass','DSA','easy',10),
('Reverse Linked List','Reverse a singly linked list in-place.','class ListNode:\n    def __init__(self, val=0, next=None): self.val=val; self.next=next\n\ndef reverse_list(head):\n    # Iterative O(n)\n    pass','DSA','easy',10)
ON CONFLICT DO NOTHING;

-- DSA MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Longest Substring Without Repeating','Find the length of the longest substring without repeating characters.','# ''abcabcbb'' → 3\ndef length_of_longest_substring(s: str) -> int:\n    # Sliding window\n    pass','DSA','medium',20),
('Number of Islands','Count islands (connected 1s) in a 2D grid using BFS or DFS.','def num_islands(grid: list) -> int:\n    # BFS or DFS approach\n    pass','DSA','medium',20),
('Coin Change','Find fewest coins needed to make up the amount (DP).','# coins=[1,2,5], amount=11 → 3\ndef coin_change(coins: list, amount: int) -> int:\n    # Bottom-up DP\n    pass','DSA','medium',20),
('Top K Frequent Elements','Return the k most frequent elements using a heap.','# nums=[1,1,1,2,2,3], k=2 → [1,2]\ndef top_k_frequent(nums: list, k: int) -> list:\n    pass','DSA','medium',20),
('Binary Tree Level Order','Return level-order traversal of a binary tree (BFS).','class TreeNode:\n    def __init__(self, val=0, left=None, right=None): self.val=val\n\ndef level_order(root) -> list:\n    # BFS using a queue\n    pass','DSA','medium',20),
('Product Except Self','Return array where each element is product of all others (no division).','# [1,2,3,4] → [24,12,8,6]\ndef product_except_self(nums: list) -> list:\n    pass','DSA','medium',20)
ON CONFLICT DO NOTHING;

-- DSA HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Trapping Rain Water','Calculate how much rain water can be trapped between bars.','# [0,1,0,2,1,0,1,3,2,1,2,1] → 6\ndef trap(height: list) -> int:\n    # Two pointers O(n) O(1)\n    pass','DSA','hard',35),
('Merge K Sorted Lists','Merge k sorted linked lists into one sorted list using a min-heap.','import heapq\ndef merge_k_lists(lists: list):\n    # Use a min-heap\n    pass','DSA','hard',35),
('Longest Increasing Subsequence','Find the length of the longest strictly increasing subsequence.','# [10,9,2,5,3,7,101,18] → 4\ndef length_of_lis(nums: list) -> int:\n    # O(n log n)\n    pass','DSA','hard',35),
('Word Ladder','Find shortest transformation sequence from beginWord to endWord.','from collections import deque\ndef ladder_length(beginWord: str, endWord: str, wordList: list) -> int:\n    # BFS approach\n    pass','DSA','hard',35)
ON CONFLICT DO NOTHING;

-- SQL EASY
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('SELECT with Filters','Write queries using WHERE, ORDER BY, and LIMIT clauses.','-- Find all employees with salary > 50000, ordered by salary descending\nSELECT name, salary\nFROM employees\nWHERE -- your condition\nORDER BY -- your order\nLIMIT 10;','SQL','easy',10),
('Aggregate Functions','Use COUNT, SUM, AVG, MIN, MAX in queries.','-- Count employees per department and show avg salary\nSELECT dept_id, COUNT(*) as emp_count, AVG(salary) as avg_sal\nFROM employees\nGROUP BY -- your code here','SQL','easy',10)
ON CONFLICT DO NOTHING;

-- SQL MEDIUM
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('JOIN Operations','Write INNER, LEFT, and RIGHT JOINs between tables.','-- Get employee names with their department names\nSELECT e.name, d.dept_name\nFROM employees e\n-- Your JOIN here\n\n-- Get all departments even without employees\n-- Your LEFT JOIN here','SQL','medium',20),
('Subqueries','Use correlated and non-correlated subqueries.','-- Find employees earning more than average salary\nSELECT name, salary FROM employees\nWHERE salary > (-- subquery here)','SQL','medium',20)
ON CONFLICT DO NOTHING;

-- SQL HARD
INSERT INTO public.questions (title, question_text, starter_code, language, difficulty, xp_reward) VALUES
('Window Functions','Use ROW_NUMBER, RANK, and PARTITION BY for rankings.','-- Rank employees by salary within each department\nSELECT name, dept_id, salary,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rank\nFROM employees;','SQL','hard',35),
('Common Table Expressions','Use WITH clauses for hierarchical data and complex logic.','-- Find all reports of a manager recursively\nWITH RECURSIVE reports AS (\n    SELECT id, name, manager_id FROM employees WHERE id = 1\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id FROM employees e\n    INNER JOIN reports r ON e.manager_id = r.id\n)\nSELECT * FROM reports;','SQL','hard',35)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Done! All tables, RLS policies, triggers, RPCs and seed
-- data are now set up for Skill Navigator.
-- ============================================================
