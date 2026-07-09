package com.skillpath.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionGeneratorService {

    private final Random random = new Random();

    private final String[] languages = {"Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust", "SQL", "DSA"};
    private final String[] difficulties = {"Easy", "Medium", "Hard"};

    private final Map<String, Map<String, List<QuestionTemplate>>> questionTemplates = new HashMap<>();

    public QuestionGeneratorService() {
        initializeTemplates();
    }

    private void initializeTemplates() {

        // ─────────── PYTHON ───────────
        Map<String, List<QuestionTemplate>> pythonTemplates = new HashMap<>();
        pythonTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Reverse a String", "Write a Python function to reverse a string without using slicing.",
                "def reverse_string(s: str) -> str:\n    # Your code here\n    pass"),
            new QuestionTemplate("Find Maximum", "Write a Python function to find the maximum element in a list.",
                "def find_max(lst: list) -> int:\n    # Your code here\n    pass"),
            new QuestionTemplate("Check Palindrome", "Write a Python function to check if a string is a palindrome (case-insensitive).",
                "def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass"),
            new QuestionTemplate("Count Vowels", "Write a Python function to count the number of vowels in a string.",
                "def count_vowels(s: str) -> int:\n    # Your code here\n    pass"),
            new QuestionTemplate("Sum of List", "Calculate the sum of all numbers in a list without using sum().",
                "def sum_list(lst: list) -> int:\n    # Your code here\n    pass"),
            new QuestionTemplate("FizzBuzz", "Print 1-100 replacing multiples of 3 with 'Fizz', 5 with 'Buzz', both with 'FizzBuzz'.",
                "def fizzbuzz() -> None:\n    # Your code here\n    pass"),
            new QuestionTemplate("Remove Duplicates", "Remove duplicates from a list while preserving insertion order.",
                "def remove_duplicates(lst: list) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Factorial", "Compute the factorial of n using both iterative and recursive approaches.",
                "def factorial(n: int) -> int:\n    # Your code here\n    pass"),
            new QuestionTemplate("Fibonacci Sequence", "Return the first n Fibonacci numbers as a list.",
                "def fibonacci(n: int) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("List Comprehension Filter", "Use list comprehension to filter all even numbers from a list.",
                "def filter_evens(lst: list) -> list:\n    # Your code here\n    pass")
        ));
        pythonTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Two Sum", "Find two numbers in a list that add up to the target. Return their indices.",
                "def two_sum(nums: list, target: int) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Implement Stack", "Create a Stack class with push, pop, peek, and is_empty methods.",
                "class Stack:\n    def __init__(self):\n        pass\n\n    def push(self, item):\n        pass\n\n    def pop(self):\n        pass\n\n    def peek(self):\n        pass\n\n    def is_empty(self) -> bool:\n        pass"),
            new QuestionTemplate("Binary Search", "Implement binary search on a sorted list. Return index or -1.",
                "def binary_search(arr: list, target: int) -> int:\n    # Your code here\n    pass"),
            new QuestionTemplate("Merge Sorted Arrays", "Merge two sorted arrays into one sorted array efficiently.",
                "def merge_sorted(arr1: list, arr2: list) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Anagram Check", "Check if two strings are anagrams of each other (ignore spaces, case).",
                "def is_anagram(s1: str, s2: str) -> bool:\n    # Your code here\n    pass"),
            new QuestionTemplate("Matrix Transpose", "Transpose an N×M matrix in-place.",
                "def transpose(matrix: list) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Flatten Nested List", "Flatten a deeply nested list into a single flat list.",
                "def flatten(nested: list) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Group Anagrams", "Group words that are anagrams together from a list of strings.",
                "def group_anagrams(words: list) -> list:\n    # Your code here\n    pass")
        ));
        pythonTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("LRU Cache", "Implement an LRU Cache with O(1) get and put operations.",
                "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass"),
            new QuestionTemplate("Trie Implementation", "Implement a Trie with insert, search, and startsWith methods.",
                "class Trie:\n    def __init__(self):\n        pass\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        pass\n\n    def startsWith(self, prefix: str) -> bool:\n        pass"),
            new QuestionTemplate("Graph BFS & DFS", "Implement both BFS and DFS for an adjacency list graph.",
                "def bfs(graph: dict, start: str) -> list:\n    # Your code here\n    pass\n\ndef dfs(graph: dict, start: str) -> list:\n    # Your code here\n    pass"),
            new QuestionTemplate("Longest Palindromic Substring", "Find the longest palindromic substring using dynamic programming.",
                "def longest_palindrome(s: str) -> str:\n    # Your code here\n    pass"),
            new QuestionTemplate("Word Break Problem", "Determine if a string can be segmented into dictionary words.",
                "def word_break(s: str, word_dict: list) -> bool:\n    # Your code here\n    pass")
        ));
        questionTemplates.put("Python", pythonTemplates);

        // ─────────── JAVASCRIPT ───────────
        Map<String, List<QuestionTemplate>> jsTemplates = new HashMap<>();
        jsTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Array Sum", "Sum all numbers in an array without using reduce().",
                "function sumArray(arr) {\n    // Your code here\n}"),
            new QuestionTemplate("Find Average", "Find the average of numbers in an array. Handle empty arrays.",
                "function findAverage(arr) {\n    // Your code here\n}"),
            new QuestionTemplate("String Reversal", "Reverse a string without using built-in reverse().",
                "function reverseString(str) {\n    // Your code here\n}"),
            new QuestionTemplate("Filter Even Numbers", "Filter even numbers from an array using a loop (no filter()).",
                "function filterEven(arr) {\n    // Your code here\n}"),
            new QuestionTemplate("Capitalize Words", "Capitalize the first letter of every word in a sentence.",
                "function capitalizeWords(sentence) {\n    // Your code here\n}"),
            new QuestionTemplate("Count Occurrences", "Count how many times each element appears in an array.",
                "function countOccurrences(arr) {\n    // Returns an object { element: count }\n}"),
            new QuestionTemplate("Flatten Array", "Flatten a one-level nested array without using flat().",
                "function flattenArray(arr) {\n    // Your code here\n}"),
            new QuestionTemplate("Remove Falsy Values", "Remove all falsy values (false, null, 0, '', undefined, NaN) from an array.",
                "function removeFalsy(arr) {\n    // Your code here\n}")
        ));
        jsTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Debounce Function", "Implement a debounce function that delays execution.",
                "function debounce(func, delay) {\n    // Your code here\n}"),
            new QuestionTemplate("Deep Clone", "Deep clone a JavaScript object (handle nested objects and arrays).",
                "function deepClone(obj) {\n    // Your code here\n}"),
            new QuestionTemplate("Custom Promise.all", "Implement your own version of Promise.all.",
                "function promiseAll(promises) {\n    // Your code here\n}"),
            new QuestionTemplate("Memoize Function", "Write a memoize higher-order function that caches results.",
                "function memoize(fn) {\n    // Your code here\n}"),
            new QuestionTemplate("Throttle Function", "Implement a throttle function that limits execution rate.",
                "function throttle(func, limit) {\n    // Your code here\n}"),
            new QuestionTemplate("Curry Function", "Implement function currying for any number of arguments.",
                "function curry(fn) {\n    // Your code here\n}"),
            new QuestionTemplate("Flatten Deep", "Deeply flatten a nested array of any depth.",
                "function flattenDeep(arr) {\n    // Your code here\n}")
        ));
        jsTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Event Emitter", "Create an EventEmitter class with on, off, once, and emit methods.",
                "class EventEmitter {\n    constructor() {}\n\n    on(event, listener) {}\n\n    off(event, listener) {}\n\n    once(event, listener) {}\n\n    emit(event, ...args) {}\n}"),
            new QuestionTemplate("LRU Cache in JS", "Implement an LRU Cache with O(1) get/put using Map.",
                "class LRUCache {\n    constructor(capacity) {\n        // Your code here\n    }\n\n    get(key) {\n        // Your code here\n    }\n\n    put(key, value) {\n        // Your code here\n    }\n}"),
            new QuestionTemplate("Async Queue", "Build an async task queue that runs tasks with concurrency limit.",
                "class AsyncQueue {\n    constructor(concurrency) {\n        // Your code here\n    }\n\n    add(task) {\n        // task is an async function\n    }\n}"),
            new QuestionTemplate("Observable Pattern", "Implement a basic Observable pattern with subscribe, unsubscribe.",
                "class Observable {\n    constructor(subscribeFn) {\n        // Your code here\n    }\n\n    subscribe(observer) {\n        // Your code here\n    }\n}")
        ));
        questionTemplates.put("JavaScript", jsTemplates);

        // ─────────── JAVA ───────────
        Map<String, List<QuestionTemplate>> javaTemplates = new HashMap<>();
        javaTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Reverse Array", "Reverse an integer array in-place without extra space.",
                "public static void reverseArray(int[] arr) {\n    // Your code here\n}"),
            new QuestionTemplate("Find Peak Element", "Find a peak element (greater than neighbours) in an array.",
                "public static int findPeak(int[] arr) {\n    // Your code here\n}"),
            new QuestionTemplate("String Palindrome", "Check if a string is a palindrome ignoring case and spaces.",
                "public static boolean isPalindrome(String s) {\n    // Your code here\n}"),
            new QuestionTemplate("Count Characters", "Count the frequency of each character in a string using HashMap.",
                "public static Map<Character, Integer> countChars(String s) {\n    // Your code here\n}"),
            new QuestionTemplate("Fibonacci Iterative", "Generate first N Fibonacci numbers iteratively.",
                "public static int[] fibonacci(int n) {\n    // Your code here\n}"),
            new QuestionTemplate("Second Largest", "Find the second largest element in an array.",
                "public static int secondLargest(int[] arr) {\n    // Your code here\n}")
        ));
        javaTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Singleton Pattern", "Implement thread-safe Singleton using double-checked locking.",
                "public class Singleton {\n    private static volatile Singleton instance;\n\n    private Singleton() {}\n\n    public static Singleton getInstance() {\n        // Your code here\n    }\n}"),
            new QuestionTemplate("Singly Linked List", "Create a singly linked list with insert, delete, and display.",
                "class LinkedList {\n    class Node {\n        int data;\n        Node next;\n    }\n    Node head;\n\n    public void insert(int data) {}\n    public void delete(int data) {}\n    public void display() {}\n}"),
            new QuestionTemplate("Custom HashMap", "Build a simple HashMap with put, get, remove using arrays.",
                "class MyHashMap {\n    public void put(int key, int value) {}\n    public int get(int key) { return -1; }\n    public void remove(int key) {}\n}"),
            new QuestionTemplate("Stack with Min", "Design a stack that supports push, pop, and getMin in O(1).",
                "class MinStack {\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}"),
            new QuestionTemplate("Merge Intervals", "Merge overlapping intervals from a sorted list.",
                "public static int[][] merge(int[][] intervals) {\n    // Your code here\n}")
        ));
        javaTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Thread Pool Executor", "Implement a basic thread pool with a work queue.",
                "class ThreadPool {\n    private final int poolSize;\n    ThreadPool(int size) { this.poolSize = size; }\n    public void submit(Runnable task) {}\n    public void shutdown() {}\n}"),
            new QuestionTemplate("Binary Search Tree", "Implement BST with insert, search, delete, and inorder traversal.",
                "class BST {\n    class Node { int val; Node left, right; }\n    Node root;\n    public void insert(int val) {}\n    public boolean search(int val) { return false; }\n    public void delete(int val) {}\n    public List<Integer> inorder() { return null; }\n}"),
            new QuestionTemplate("LRU Cache Java", "Implement LRU Cache using LinkedHashMap or custom doubly linked list.",
                "class LRUCache {\n    private final int capacity;\n    LRUCache(int capacity) { this.capacity = capacity; }\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}"),
            new QuestionTemplate("Producer Consumer", "Implement producer-consumer using BlockingQueue and threads.",
                "class ProducerConsumer {\n    // Implement using BlockingQueue\n    public void produce(int item) throws InterruptedException {}\n    public int consume() throws InterruptedException { return 0; }\n}")
        ));
        questionTemplates.put("Java", javaTemplates);

        // ─────────── C++ ───────────
        Map<String, List<QuestionTemplate>> cppTemplates = new HashMap<>();
        cppTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Bubble Sort", "Implement optimized bubble sort (stop early if already sorted).",
                "void bubbleSort(vector<int>& arr) {\n    // Your code here\n}"),
            new QuestionTemplate("Find Element", "Find an element in a vector and return its index or -1.",
                "int findElement(const vector<int>& arr, int target) {\n    // Your code here\n}"),
            new QuestionTemplate("Swap Without Temp", "Swap two integers without using a temporary variable.",
                "void swap(int& a, int& b) {\n    // Your code here\n}"),
            new QuestionTemplate("Count Digits", "Count the number of digits in an integer.",
                "int countDigits(int n) {\n    // Your code here\n}"),
            new QuestionTemplate("Prime Check", "Check if a number is prime efficiently.",
                "bool isPrime(int n) {\n    // Your code here\n}")
        ));
        cppTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Smart Pointer", "Create a simple unique_ptr implementation from scratch.",
                "template<typename T>\nclass UniquePtr {\n    T* ptr;\npublic:\n    explicit UniquePtr(T* p) : ptr(p) {}\n    ~UniquePtr() { delete ptr; }\n    T& operator*() { return *ptr; }\n    T* operator->() { return ptr; }\n    // Disable copy, enable move\n};"),
            new QuestionTemplate("Linked List C++", "Implement singly linked list with insert, delete, reverse.",
                "struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int v) : val(v), next(nullptr) {}\n};\n\nListNode* insert(ListNode* head, int val) {}\nListNode* deleteNode(ListNode* head, int val) {}\nListNode* reverse(ListNode* head) {}"),
            new QuestionTemplate("Implement Queue using Stacks", "Implement a queue using two stacks.",
                "class MyQueue {\n    stack<int> s1, s2;\npublic:\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return true; }\n};"),
            new QuestionTemplate("Template Stack", "Implement a generic Stack class using templates.",
                "template<typename T>\nclass Stack {\npublic:\n    void push(T val) {}\n    T pop() {}\n    T peek() {}\n    bool isEmpty() { return true; }\n};")
        ));
        cppTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Vector Implementation", "Build a dynamic array (like std::vector) with push_back, resize.",
                "template<typename T>\nclass Vector {\n    T* data;\n    size_t sz, cap;\npublic:\n    Vector() : data(nullptr), sz(0), cap(0) {}\n    void push_back(const T& val) {}\n    T& operator[](size_t i) { return data[i]; }\n    size_t size() const { return sz; }\n};"),
            new QuestionTemplate("Binary Search Tree C++", "BST with insert, search, delete, and level-order traversal.",
                "class BST {\n    struct Node { int val; Node *left, *right; };\n    Node* root;\npublic:\n    void insert(int val) {}\n    bool search(int val) { return false; }\n    void remove(int val) {}\n    vector<int> levelOrder() { return {}; }\n};"),
            new QuestionTemplate("Thread-Safe Singleton C++", "Implement thread-safe Singleton using call_once.",
                "#include <mutex>\nclass Singleton {\n    static Singleton* instance;\n    static once_flag initFlag;\n    Singleton() = default;\npublic:\n    static Singleton* getInstance() {}\n};")
        ));
        questionTemplates.put("C++", cppTemplates);

        // ─────────── TYPESCRIPT ───────────
        Map<String, List<QuestionTemplate>> tsTemplates = new HashMap<>();
        tsTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Generic Array Reverse", "Write a generic function that reverses an array of any type.",
                "function reverseArray<T>(arr: T[]): T[] {\n    // Your code here\n}"),
            new QuestionTemplate("User Interface", "Create a User interface and a function to format user display name.",
                "interface User {\n    id: number;\n    firstName: string;\n    lastName: string;\n    email: string;\n}\n\nfunction formatDisplayName(user: User): string {\n    // Your code here\n}"),
            new QuestionTemplate("Enum State Machine", "Use enums to model a simple order status state machine.",
                "enum OrderStatus {\n    // Define states\n}\n\nfunction nextStatus(current: OrderStatus): OrderStatus {\n    // Your code here\n}"),
            new QuestionTemplate("Optional Chaining", "Write a function to safely access deeply nested optional properties.",
                "interface Config {\n    server?: { host?: string; port?: number; };\n}\n\nfunction getPort(config: Config): number {\n    // Use optional chaining\n}")
        ));
        tsTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Generic Utility Types", "Implement your own Partial<T>, Required<T>, and Readonly<T>.",
                "type MyPartial<T> = {\n    // Your code here\n};\n\ntype MyRequired<T> = {\n    // Your code here\n};\n\ntype MyReadonly<T> = {\n    // Your code here\n};"),
            new QuestionTemplate("Custom Type Guards", "Write type guards for a discriminated union of shapes.",
                "type Circle = { kind: 'circle'; radius: number };\ntype Rectangle = { kind: 'rect'; width: number; height: number };\ntype Shape = Circle | Rectangle;\n\nfunction isCircle(s: Shape): s is Circle {\n    // Your code here\n}\n\nfunction area(s: Shape): number {\n    // Your code here\n}"),
            new QuestionTemplate("Mapped Types", "Create a mapped type that makes all string values uppercase type.",
                "type Uppercase<T> = {\n    // Your code here\n};\n\ntype ToOptional<T> = {\n    // Make all properties optional with default\n};"),
            new QuestionTemplate("Generic Repository", "Create a generic Repository class with CRUD operations.",
                "class Repository<T extends { id: number }> {\n    private items: T[] = [];\n\n    add(item: T): void {}\n    findById(id: number): T | undefined { return undefined; }\n    update(id: number, partial: Partial<T>): void {}\n    delete(id: number): void {}\n    getAll(): T[] { return []; }\n}")
        ));
        tsTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Type-Safe Event Bus", "Create a strongly typed event bus with type inference.",
                "type EventMap = {\n    login: { userId: string };\n    logout: void;\n    error: { message: string };\n};\n\nclass TypedEventBus {\n    on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {}\n    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {}\n}"),
            new QuestionTemplate("Builder Pattern TS", "Implement a fluent builder pattern with method chaining and types.",
                "class QueryBuilder<T> {\n    private conditions: string[] = [];\n    private limitVal?: number;\n\n    where(condition: string): this { return this; }\n    limit(n: number): this { return this; }\n    build(): string { return ''; }\n}")
        ));
        questionTemplates.put("TypeScript", tsTemplates);

        // ─────────── GO ───────────
        Map<String, List<QuestionTemplate>> goTemplates = new HashMap<>();
        goTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Slice Operations", "Write functions to sum, max, and filter a slice of integers.",
                "func Sum(arr []int) int {\n    // Your code here\n}\n\nfunc Max(arr []int) int {\n    // Your code here\n}"),
            new QuestionTemplate("Word Frequency Map", "Count word frequencies from a string using maps.",
                "func CountWords(text string) map[string]int {\n    // Your code here\n}"),
            new QuestionTemplate("Struct Methods", "Define a Rectangle struct with Area and Perimeter methods.",
                "type Rectangle struct {\n    Width, Height float64\n}\n\nfunc (r Rectangle) Area() float64 {\n    // Your code here\n}\n\nfunc (r Rectangle) Perimeter() float64 {\n    // Your code here\n}"),
            new QuestionTemplate("Error Handling", "Write a safe divide function that returns an error on division by zero.",
                "func safeDivide(a, b float64) (float64, error) {\n    // Your code here\n}")
        ));
        goTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Goroutine Ping-Pong", "Use channels to ping-pong messages between two goroutines.",
                "func ping(pings chan<- string, msg string) {\n    // Your code here\n}\n\nfunc pong(pings <-chan string, pongs chan<- string) {\n    // Your code here\n}"),
            new QuestionTemplate("Simple HTTP Server", "Build a REST API with two endpoints using net/http.",
                "func helloHandler(w http.ResponseWriter, r *http.Request) {\n    // Your code here\n}\n\nfunc main() {\n    // Register routes and start server\n}"),
            new QuestionTemplate("Interface Implementation", "Define a Shape interface and implement it for Circle and Square.",
                "type Shape interface {\n    Area() float64\n    Perimeter() float64\n}\n\ntype Circle struct { Radius float64 }\ntype Square struct { Side float64 }\n\n// Implement Shape for both"),
            new QuestionTemplate("Fan-Out Pattern", "Use goroutines to process multiple jobs concurrently and collect results.",
                "func process(jobs []int) []int {\n    // Fan out to goroutines, collect results\n}")
        ));
        goTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Worker Pool", "Implement a worker pool pattern in Go with configurable workers.",
                "type Job struct{ ID int }\ntype Result struct{ JobID, Output int }\n\nfunc workerPool(numWorkers int, jobs <-chan Job, results chan<- Result) {\n    // Your code here\n}"),
            new QuestionTemplate("Rate Limiter", "Implement a token bucket rate limiter using channels.",
                "type RateLimiter struct{}\n\nfunc NewRateLimiter(rate int) *RateLimiter {\n    // Your code here\n}\n\nfunc (r *RateLimiter) Allow() bool {\n    // Your code here\n}")
        ));
        questionTemplates.put("Go", goTemplates);

        // ─────────── RUST ───────────
        Map<String, List<QuestionTemplate>> rustTemplates = new HashMap<>();
        rustTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Pattern Matching", "Use match to parse an enum of commands.",
                "enum Command { Quit, Move { x: i32, y: i32 }, Write(String) }\n\nfn process(cmd: Command) -> String {\n    // Your code here\n}"),
            new QuestionTemplate("Iterator Transformations", "Use iterators to square and filter a vector.",
                "fn transform(v: Vec<i32>) -> Vec<i32> {\n    // Use .map() and .filter()\n}"),
            new QuestionTemplate("Ownership and Borrowing", "Write a function that takes a string slice and counts words.",
                "fn count_words(s: &str) -> usize {\n    // Your code here\n}"),
            new QuestionTemplate("Option Handling", "Write a function that safely divides and returns Option<f64>.",
                "fn safe_div(a: f64, b: f64) -> Option<f64> {\n    // Your code here\n}")
        ));
        rustTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Custom Iterator", "Implement a Fibonacci iterator using the Iterator trait.",
                "struct Fibonacci { a: u64, b: u64 }\n\nimpl Fibonacci {\n    fn new() -> Self { Fibonacci { a: 0, b: 1 } }\n}\n\nimpl Iterator for Fibonacci {\n    type Item = u64;\n    fn next(&mut self) -> Option<u64> {\n        // Your code here\n    }\n}"),
            new QuestionTemplate("Result Error Handling", "Build a CSV parser that returns Result<Vec<Row>, ParseError>.",
                "use std::num::ParseIntError;\n\n#[derive(Debug)]\nenum ParseError { InvalidFormat, InvalidNumber(ParseIntError) }\n\nfn parse_csv(input: &str) -> Result<Vec<Vec<String>>, ParseError> {\n    // Your code here\n}"),
            new QuestionTemplate("Generic Stack", "Implement a generic Stack<T> with push, pop, and peek.",
                "struct Stack<T> {\n    items: Vec<T>,\n}\n\nimpl<T> Stack<T> {\n    fn new() -> Self { Stack { items: vec![] } }\n    fn push(&mut self, item: T) {}\n    fn pop(&mut self) -> Option<T> { None }\n    fn peek(&self) -> Option<&T> { None }\n}")
        ));
        rustTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Traits and Generics", "Implement a generic Sortable trait with sort and binary_search.",
                "trait Sortable<T: Ord> {\n    fn sort(&mut self);\n    fn binary_search(&self, target: &T) -> Option<usize>;\n}\n\nimpl<T: Ord> Sortable<T> for Vec<T> {\n    // Your code here\n}"),
            new QuestionTemplate("Arc Mutex Counter", "Implement a shared concurrent counter using Arc and Mutex.",
                "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn concurrent_counter(num_threads: usize, increments: usize) -> usize {\n    // Your code here\n}")
        ));
        questionTemplates.put("Rust", rustTemplates);

        // ─────────── SQL ───────────
        Map<String, List<QuestionTemplate>> sqlTemplates = new HashMap<>();
        sqlTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("SELECT with Filters", "Write queries using WHERE, ORDER BY, and LIMIT clauses.",
                "-- Find all employees with salary > 50000, ordered by salary descending\nSELECT -- your code here\nFROM employees\n-- add conditions"),
            new QuestionTemplate("Aggregate Functions", "Use COUNT, SUM, AVG, MIN, MAX in queries.",
                "-- Count employees per department and show avg salary\nSELECT -- your code here\nFROM employees\nGROUP BY -- your code here"),
            new QuestionTemplate("INSERT and UPDATE", "Write INSERT and UPDATE statements for an orders table.",
                "-- Insert a new order\nINSERT INTO orders -- your code here\n\n-- Update order status\nUPDATE orders -- your code here"),
            new QuestionTemplate("DISTINCT and LIKE", "Find unique departments and use LIKE for pattern matching.",
                "-- Find all unique job titles\nSELECT DISTINCT -- your code here\n\n-- Find employees whose name starts with 'A'\nSELECT -- your code here\nWHERE name LIKE -- your code here")
        ));
        sqlTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("JOIN Operations", "Write INNER, LEFT, and RIGHT JOINs between tables.",
                "-- Get employee names with their department names\nSELECT e.name, d.dept_name\nFROM employees e\n-- Your JOIN here\n\n-- Get all departments even if no employees\n-- Your LEFT JOIN here"),
            new QuestionTemplate("Subqueries", "Use correlated and non-correlated subqueries.",
                "-- Find employees earning more than average salary\nSELECT name, salary FROM employees\nWHERE salary > (-- subquery here)\n\n-- Find employees in the top 3 salary departments\n-- your code here"),
            new QuestionTemplate("CASE Expressions", "Use CASE WHEN to categorize salary ranges.",
                "SELECT name, salary,\n    CASE\n        -- Define: Low, Medium, High salary brackets\n    END AS salary_level\nFROM employees"),
            new QuestionTemplate("GROUP BY + HAVING", "Find departments with more than 5 employees and avg salary > 60000.",
                "SELECT dept_id, COUNT(*) as emp_count, AVG(salary) as avg_sal\nFROM employees\nGROUP BY -- your code\nHAVING -- your conditions")
        ));
        sqlTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Window Functions", "Use ROW_NUMBER, RANK, and PARTITION BY for rankings.",
                "-- Rank employees by salary within each department\nSELECT name, dept_id, salary,\n    ROW_NUMBER() OVER (-- your PARTITION and ORDER here) as rank\nFROM employees\n\n-- Get top 3 earners per department\n-- your code here"),
            new QuestionTemplate("Common Table Expressions", "Use WITH clauses for hierarchical data and complex logic.",
                "-- Find all direct and indirect reports of a manager\nWITH RECURSIVE reports AS (\n    -- base case\n    SELECT -- your code here\n    UNION ALL\n    -- recursive case\n    SELECT -- your code here\n)\nSELECT * FROM reports;"),
            new QuestionTemplate("Query Optimization", "Rewrite slow queries using indexes and avoiding N+1 problems.",
                "-- Original slow query (optimize this):\nSELECT * FROM orders WHERE YEAR(created_at) = 2024;\n\n-- Rewrite to use index:\n-- Your optimized query here\n\n-- Avoid N+1: get users and their order count in one query\n-- Your code here")
        ));
        questionTemplates.put("SQL", sqlTemplates);

        // ─────────── DSA (Data Structures & Algorithms) ───────────
        Map<String, List<QuestionTemplate>> dsaTemplates = new HashMap<>();
        dsaTemplates.put("Easy", Arrays.asList(
            new QuestionTemplate("Two Sum", "Given an array and a target, find two indices whose values sum to target.",
                "# Example: nums = [2, 7, 11, 15], target = 9 → [0, 1]\ndef two_sum(nums: list, target: int) -> list:\n    # Solve in O(n) using a hash map\n    pass"),
            new QuestionTemplate("Valid Parentheses", "Check if a string of brackets is valid using a stack.",
                "# Example: '({[]})' → True, '([)]' → False\ndef is_valid(s: str) -> bool:\n    # Use a stack\n    pass"),
            new QuestionTemplate("Merge Two Sorted Lists", "Merge two sorted linked lists into one sorted list.",
                "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\n\ndef merge_lists(l1: ListNode, l2: ListNode) -> ListNode:\n    # Your code here\n    pass"),
            new QuestionTemplate("Maximum Subarray (Kadane's)", "Find the subarray with the largest sum using Kadane's algorithm.",
                "# Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6\ndef max_subarray(nums: list) -> int:\n    # Kadane's algorithm O(n)\n    pass"),
            new QuestionTemplate("Binary Search", "Implement binary search on a sorted array.",
                "# Example: arr=[1,3,5,7,9], target=7 → index 3\ndef binary_search(arr: list, target: int) -> int:\n    # O(log n) solution\n    pass"),
            new QuestionTemplate("Climbing Stairs (DP)", "Count ways to climb n stairs taking 1 or 2 steps at a time.",
                "# Example: n=3 → 3 ways: (1+1+1), (1+2), (2+1)\ndef climb_stairs(n: int) -> int:\n    # Dynamic programming\n    pass"),
            new QuestionTemplate("Reverse Linked List", "Reverse a singly linked list in-place.",
                "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\n\ndef reverse_list(head: ListNode) -> ListNode:\n    # Iterative O(n)\n    pass")
        ));
        dsaTemplates.put("Medium", Arrays.asList(
            new QuestionTemplate("Longest Substring Without Repeating", "Find the length of the longest substring without repeating characters.",
                "# Example: 'abcabcbb' → 3 ('abc'), 'bbbbb' → 1\ndef length_of_longest_substring(s: str) -> int:\n    # Sliding window approach\n    pass"),
            new QuestionTemplate("Product of Array Except Self", "Return an array where each element is the product of all others.",
                "# Example: [1,2,3,4] → [24,12,8,6]\ndef product_except_self(nums: list) -> list:\n    # O(n) without division\n    pass"),
            new QuestionTemplate("Number of Islands (BFS/DFS)", "Count islands (connected 1s) in a 2D grid using BFS or DFS.",
                "# grid = [['1','1','0'],['0','1','0'],['0','0','1']] → 2\ndef num_islands(grid: list) -> int:\n    # BFS or DFS approach\n    pass"),
            new QuestionTemplate("Coin Change (DP)", "Find fewest coins needed to make up the amount.",
                "# Example: coins=[1,2,5], amount=11 → 3 (5+5+1)\ndef coin_change(coins: list, amount: int) -> int:\n    # Bottom-up DP\n    pass"),
            new QuestionTemplate("Top K Frequent Elements", "Return the k most frequent elements using a heap.",
                "# Example: nums=[1,1,1,2,2,3], k=2 → [1,2]\ndef top_k_frequent(nums: list, k: int) -> list:\n    # Use heap or bucket sort\n    pass"),
            new QuestionTemplate("Binary Tree Level Order", "Return level-order traversal of a binary tree (BFS).",
                "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val=val; self.left=left; self.right=right\n\ndef level_order(root: TreeNode) -> list:\n    # BFS using a queue\n    pass"),
            new QuestionTemplate("Spiral Matrix", "Return all elements of an N×M matrix in spiral order.",
                "# [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]\ndef spiral_order(matrix: list) -> list:\n    # Use boundary pointers\n    pass")
        ));
        dsaTemplates.put("Hard", Arrays.asList(
            new QuestionTemplate("Merge K Sorted Lists", "Merge k sorted linked lists into one sorted list.",
                "import heapq\nclass ListNode:\n    def __init__(self, val=0, next=None): self.val=val; self.next=next\n\ndef merge_k_lists(lists: list) -> ListNode:\n    # Use a min-heap\n    pass"),
            new QuestionTemplate("Trapping Rain Water", "Calculate how much rain water can be trapped between bars.",
                "# Example: [0,1,0,2,1,0,1,3,2,1,2,1] → 6\ndef trap(height: list) -> int:\n    # Two pointers O(n) O(1)\n    pass"),
            new QuestionTemplate("Word Ladder (BFS)", "Find shortest transformation sequence from beginWord to endWord.",
                "from collections import deque\ndef ladder_length(beginWord: str, endWord: str, wordList: list) -> int:\n    # BFS, change one char at a time\n    pass"),
            new QuestionTemplate("Serialize & Deserialize Binary Tree", "Serialize a binary tree to string and deserialize back.",
                "class TreeNode:\n    def __init__(self, val=0, left=None, right=None): self.val=val\n\nclass Codec:\n    def serialize(self, root: TreeNode) -> str:\n        pass\n\n    def deserialize(self, data: str) -> TreeNode:\n        pass"),
            new QuestionTemplate("Longest Increasing Subsequence", "Find the length of the longest strictly increasing subsequence.",
                "# Example: [10, 9, 2, 5, 3, 7, 101, 18] → 4 ([2,3,7,101])\ndef length_of_lis(nums: list) -> int:\n    # O(n log n) using patience sorting / binary search\n    pass"),
            new QuestionTemplate("Alien Dictionary (Topological Sort)", "Given alien-language sorted words, find the character order.",
                "def alien_order(words: list) -> str:\n    # Build graph, topological sort (Kahn's or DFS)\n    # Return '' if invalid\n    pass")
        ));
        questionTemplates.put("DSA", dsaTemplates);
    }

    public QuestionData generateQuestion(String language, String difficulty) {
        String selectedLanguage = language;
        if (selectedLanguage == null || selectedLanguage.isEmpty()) {
            selectedLanguage = languages[random.nextInt(languages.length)];
        }

        // Normalize difficulty: capitalize first letter
        String selectedDifficulty = normalizeDifficulty(difficulty);

        Map<String, List<QuestionTemplate>> langTemplates = questionTemplates.get(selectedLanguage);
        if (langTemplates == null) {
            selectedLanguage = "Python";
            langTemplates = questionTemplates.get(selectedLanguage);
        }

        List<QuestionTemplate> templates = langTemplates.get(selectedDifficulty);
        if (templates == null || templates.isEmpty()) {
            selectedDifficulty = "Easy";
            templates = langTemplates.get(selectedDifficulty);
        }

        QuestionTemplate template = templates.get(random.nextInt(templates.size()));

        int xp = switch (selectedDifficulty) {
            case "Easy"   -> 10;
            case "Medium" -> 20;
            case "Hard"   -> 35;
            default       -> 10;
        };

        return new QuestionData(
            template.getTitle(),
            template.getQuestionText(),
            template.getStarterCode(),
            selectedLanguage,
            selectedDifficulty,
            xp
        );
    }

    private String normalizeDifficulty(String difficulty) {
        if (difficulty == null || difficulty.isEmpty()) {
            return difficulties[random.nextInt(difficulties.length)];
        }
        String d = difficulty.trim();
        if (d.equalsIgnoreCase("easy"))   return "Easy";
        if (d.equalsIgnoreCase("medium")) return "Medium";
        if (d.equalsIgnoreCase("hard"))   return "Hard";
        return "Easy";
    }

    public QuestionData generateRandomQuestion() {
        String language = languages[random.nextInt(languages.length)];
        String difficulty = difficulties[random.nextInt(difficulties.length)];
        return generateQuestion(language, difficulty);
    }

    public String[] getLanguages() { return languages; }
    public String[] getDifficulties() { return difficulties; }

    // ── Inner classes ──

    public static class QuestionData {
        private final String title, questionText, starterCode, language, difficulty;
        private final int xp;

        public QuestionData(String title, String questionText, String starterCode,
                            String language, String difficulty, int xp) {
            this.title = title;
            this.questionText = questionText;
            this.starterCode = starterCode;
            this.language = language;
            this.difficulty = difficulty;
            this.xp = xp;
        }

        public String getTitle()        { return title; }
        public String getQuestionText() { return questionText; }
        public String getStarterCode()  { return starterCode; }
        public String getLanguage()     { return language; }
        public String getDifficulty()   { return difficulty; }
        public int    getXp()           { return xp; }
    }

    private static class QuestionTemplate {
        private final String title, questionText, starterCode;

        public QuestionTemplate(String title, String questionText, String starterCode) {
            this.title = title;
            this.questionText = questionText;
            this.starterCode = starterCode;
        }

        public String getTitle()        { return title; }
        public String getQuestionText() { return questionText; }
        public String getStarterCode()  { return starterCode; }
    }
}
