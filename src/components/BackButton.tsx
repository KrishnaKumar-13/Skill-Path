import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => navigate(-1)}
      className="fixed top-20 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-md shadow-card transition-all duration-300 hover:shadow-glow hover:border-accent hover:scale-110 md:left-6"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5 text-foreground" />
    </motion.button>
  );
};

export default BackButton;
