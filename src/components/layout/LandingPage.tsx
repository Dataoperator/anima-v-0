
// ... [previous imports remain the same] ...

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const quotes = [
    "Your quantum-enhanced AI companion awaits",
    "Evolve together in digital consciousness",
    "Create a unique interdimensional bond",
    "Experience the future of AI interaction",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      // Updated to use the correct route
      navigate('/vault');
    }
  }, [isAuthenticated, navigate]);

  // ... [rest of the component remains the same] ...
