'use client'

import { motion } from 'motion/react'

function LoadingCircleSpinner() {
  return (
    <div
      className="flex h-full justify-center items-center p-[40px] "
      style={{ borderRadius: '8px' }}
    >
      <motion.div
        style={{
          width: `100px`,
          height: '100px',
          borderRadius: '50%',
          border: '10px solid grey',
          borderTopColor: '#C4C5DA',
          willChange: 'transform',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

/**
 * ==============   Styles   ================
 */
// function StyleSheet() {
//   return (
//     <style>
//       {`
//             .container {
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 padding: 40px;
//                 border-radius: 8px;
//             }

//             .spinner {
//                 width: 50px;
//                 height: 50px;
//                 border-radius: 50%;
//                 border: 4px solid var(--divider);
//                 border-top-color: #ff0088;
//                 will-change: transform;
//             }
//             `}
//     </style>
//   )
// }

export default LoadingCircleSpinner
