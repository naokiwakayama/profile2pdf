
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-8 w-full max-w-md"
    >
      <div className="relative w-20 h-20 mb-4">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-resume-blue border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <Loader2 className="w-8 h-8 text-resume-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <motion.p
        className="text-gray-600 font-medium text-lg text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
      
      <motion.div
        className="mt-6 w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-resume-blue"
          initial={{ width: "0%" }}
          animate={{ 
            width: ["0%", "40%", "60%", "80%", "90%"],
          }}
          transition={{ 
            times: [0, 0.4, 0.7, 0.9, 1],
            duration: 3, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingState;
