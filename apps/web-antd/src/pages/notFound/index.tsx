import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen flex-col items-center justify-center"
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
    >
      <motion.h1
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        className="text-9xl font-bold text-gray-800"
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        animate={{ opacity: 1 }}
        className="mt-4 text-xl text-gray-600"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        抱歉，您访问的页面不存在
      </motion.p>
      <motion.button
        className="mt-8 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        返回首页
      </motion.button>
    </motion.div>
  );
};

export default NotFound;
