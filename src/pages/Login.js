import Header from "../components/Header";
import Login from "../components/Login";
import ThemeToggle from "../components/ThemeToggle";


export default function LoginPage() {
  return (
    <div className="m-0 p-0">
      <span><ThemeToggle />{"<--Click here to see a magic"}</span>
    <div className="min-h-screen bg-background text-text flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
        <Login />
      </div>
    </div>
    </div>
  );
}
