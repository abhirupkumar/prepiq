
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { ThemeProvider } from './theme-provider'

const Layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <>
            <Navbar />
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
                {children}
            </ThemeProvider>
            <Footer />
        </>
    )
}

export default Layout;