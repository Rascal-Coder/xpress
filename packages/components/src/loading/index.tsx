import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

interface ThemeProps {
  $isDark: boolean;
}

const LoadingWrapper = styled(motion.div)<ThemeProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: ${({ $isDark }) => ($isDark ? '#000000' : '#ffffff')};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DotsContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const LoadingText = styled.div<ThemeProps>`
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
  font-size: 28px;
  font-weight: 600;
`;

const LoadingDot = styled(motion.div)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: hsl(var(--primary));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const loadingContainerVariants = {
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingDotVariants = {
  end: {
    y: '100%',
  },
  start: {
    y: '0%',
  },
};

const loadingDotTransition = {
  duration: 0.5,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'reverse' as const,
};

const wrapperVariants = {
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  initial: {
    opacity: 0,
  },
};

export const Loading = ({
  isDark,
  title = 'Xpress Admin',
}: {
  isDark: boolean;
  title?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <LoadingWrapper
        $isDark={isDark}
        animate="animate"
        exit="exit"
        initial="initial"
        key="loading"
        transition={{ duration: 0.3 }}
        variants={wrapperVariants}
      >
        <LoadingContainer>
          <motion.div
            animate="end"
            initial="start"
            variants={loadingContainerVariants}
          >
            <DotsContainer>
              <LoadingDot
                transition={loadingDotTransition}
                variants={loadingDotVariants}
              />
              <LoadingDot
                transition={loadingDotTransition}
                variants={loadingDotVariants}
              />
              <LoadingDot
                transition={loadingDotTransition}
                variants={loadingDotVariants}
              />
            </DotsContainer>
          </motion.div>
          <LoadingText $isDark={isDark}>{title}</LoadingText>
        </LoadingContainer>
      </LoadingWrapper>
    </AnimatePresence>
  );
};
