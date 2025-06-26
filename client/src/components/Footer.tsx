import { Github, Linkedin, Twitter } from "lucide-react"

function Footer() {
  return (
    <div className="bg-pink-50 px-30 py-5">
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h1 className="text-xl text-black">Vibe Collab</h1>
                <p className="text-md text-gray-600">Sketch Together. Think Together.</p>
                <div className="flex items-center space-x-5 py-3">
                    <Linkedin className="hover:scale-110 cursor-pointer" />
                    <Twitter className="hover:scale-110 cursor-pointer" />
                    <Github className="hover:scale-110 cursor-pointer" />
                </div>
            </div>
            <div className="flex space-x-16">
                <div className="flex flex-col">
                    <h1 className="text-md text-black hover:underline">Product</h1>
                    <a className="text-sm text-gray-600 hover:underline">Features</a>
                    <a className="text-sm text-gray-600 hover:underline">Pricing</a>
                    <a className="text-sm text-gray-600 hover:underline">About</a>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-md text-black hover:underline">Resources</h1>
                    <a className="text-sm text-gray-600 hover:underline">Blog</a>
                    <a className="text-sm text-gray-600 hover:underline">Documentation</a>
                    <a className="text-sm text-gray-600 hover:underline">Support</a>
                </div>
            </div>
        </div>
        <hr className="mt-3"></hr>
        <div className="mt-5 flex justify-between text-sm">
            <h1>&copy; 2025. All Rights Reserved</h1>
            <div className="flex space-x-6">
            <h1 className="hover:underline">Privacy</h1>
            <h1 className="hover:underline">Terms & Conditions</h1>
            </div>
        </div>
    </div>
  )
}

export default Footer