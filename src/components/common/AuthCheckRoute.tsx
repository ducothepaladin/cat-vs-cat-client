import { getAccessToken } from '@/store/authStore';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCheckRoute({ children }: { children: React.ReactNode }) {

    const navigate = useNavigate();
    const token = getAccessToken();

    useEffect(() => {
        if(token) {
            navigate("/");
        }
    },[token]);

  return (
    <div>
        {children}
    </div>
  )
}
