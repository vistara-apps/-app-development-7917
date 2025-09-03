import React, { useState } from 'react'
import { Search, User, Settings, BookOpen, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AppShell({ children, variant = 'default' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '#', icon: BookOpen, current: true },
    { name: 'Settings', href: '#', icon: Settings, current: false },
  ]

  const glassStyle = variant === 'glass' 
    ? 'bg-white/80 backdrop-blur-md border-b border-white/20' 
    : 'bg-surface border-b border-gray-200'

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50 flex">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-surface">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} user={user} signOut={signOut} />
          </div>
          <div className="w-14 flex-shrink-0" />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-surface border-r border-gray-200 pt-5">
          <SidebarContent navigation={navigation} user={user} signOut={signOut} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <div className={`sticky top-0 z-40 ${glassStyle}`}>
          <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <h1 className="text-xl font-semibold text-primary">ScholarSift</h1>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="flex items-center gap-x-2">
                  <span className="text-sm text-gray-600">
                    {user?.subscriptionTier} plan
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {user?.summariesUsed || 0}/{user?.summariesLimit || 0} summaries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, user, signOut }) {
  return (
    <>
      <div className="flex flex-shrink-0 items-center px-4">
        <h1 className="text-xl font-semibold text-primary">ScholarSift</h1>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <nav className="flex-1 space-y-1 px-2 pb-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 ${
                  item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex flex-shrink-0 p-4">
          <div className="flex w-full items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <button
                onClick={signOut}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}