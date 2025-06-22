import { Link, Outlet } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className='w-full h-lvh relative'>
        <Link 
          to="/" 
          className='absolute px-4 py-2 top-4 left-4 text-blue-600 hover:text-blue-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 bg-white'
          aria-label="Navigate to Home"
        >
          <span className="sr-only">Navigate to Home</span>
          <span className="font-bold text-xl"><Home /></span>
        </Link>
        <Outlet />
    </div>
  )
}
