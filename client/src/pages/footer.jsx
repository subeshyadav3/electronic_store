import React from "react"
import { Facebook, Github, Linkedin, Phone, Mail } from "lucide-react"
import { useToast } from "../context/toastContext"

import { Link } from "react-scroll"

export default function Footer() {
    const [email, setEmail] = React.useState("")
    const {showToast}=useToast()


    const goToTop = () => {
        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        )
    }

    const handleSubscribe = () => {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if( !email || !emailRegex.test(email)){
            return showToast("Invalid Email", "error")
        }
        
        showToast(`Subscribed with ${email}`, "success")
        setEmail("")
    }

    return (
        <div className="min-h-[500px]  relative lg:min-h-[400px] flex flex-col justify-between bg-slate-900 text-white p-8 md:p-12">
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <p className="text-gray-400">Get Latest Updates</p>
                    <h2 className="text-3xl md:text-4xl font-serif">Subscribe For Newsletter</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder="subesh@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow px-4 py-2 bg-transparent border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                    />
                    <button
                        onClick={handleSubscribe}
                        className="px-6 py-2 bg-white text-slate-900 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Subscribe Now
                    </button>
                </div>

                <div className="lg:hidden  flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
                    <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        <span>9803304345</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        <span>subeshgaming@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8 ">
                <div className="flex justify-center gap-6 lg:hidden  ">
                    <a href="#" className="p-3 rounded-full hover:bg-gray-800 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.github.com/subeshyadav3/" className="p-3 rounded-full hover:bg-gray-800 transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/subeshyadav3/" className="p-3 rounded-full hover:bg-gray-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>

                <div className="text-center text-sm text-gray-400">
                    <p>© 2025 Developed By Subesh Yadav</p>
                </div>
            </div>
            <div className="right-5 top-[80%] sm:top-1/2 sm:right-10 absolute">

                <button onClick={goToTop} className="bg-slate-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-800 transition duration-200 hover:scale-105">
                    ↑
                </button>

            </div>
        </div>
    )
}
