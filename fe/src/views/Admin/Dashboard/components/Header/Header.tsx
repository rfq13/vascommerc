import React, { CSSProperties, ReactNode } from 'react'

interface HeaderProps {
  label: string
  icon: ReactNode
  style?: CSSProperties
  className?: string
}

function Header({ label, icon, style, className }: HeaderProps) {
  return (
    <div style={style} className={`flex justify-between ${className || ''}`}>
      <div className="flex items-center">
        {icon}
        <p className="m-0 ml-3 text-2xl font-semibold">{label}</p>
      </div>
    </div>
  )
}

export default Header
