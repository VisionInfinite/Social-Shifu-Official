import LoginForm from "@/components/LoginForm"
import Logo from "@/components/Logo"
import Background from "@/components/Background"
import LanguageSelector from "@/components/LanguageSelector"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C1117] text-white relative overflow-hidden">
      <Background />
      <div className="z-10 w-full max-w-md p-8 rounded-xl bg-[#151921]/80 backdrop-blur-xl border border-white/10">
        <Logo />
        <LoginForm />
      </div>
      <LanguageSelector className="absolute top-4 right-4" />
    </div>
  )
}


// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0C1117] text-white relative overflow-hidden">
//       <h1>Login Page</h1>
//     </div>
//   )
// }
