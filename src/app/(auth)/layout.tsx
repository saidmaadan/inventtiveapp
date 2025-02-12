"use client"
import { motion } from 'framer-motion';

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.5 } }
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Column - Background Image and Text */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={backgroundVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-90" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url("/auth-bg.jpg")', 
              backgroundBlendMode: 'overlay' 
            }} 
          />
          <motion.div 
            className="relative z-10 flex flex-col justify-center px-12 text-white"
            variants={contentVariants}
          >
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Inventtive
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Streamline your workflow and boost productivity with our innovative solutions.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-indigo-100">Secure Authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-indigo-100">Lightning Fast Performance</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-indigo-100">Enterprise-grade Security</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Auth Forms */}
        <motion.div 
          className="w-full  bg-background lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
