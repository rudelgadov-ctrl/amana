import amanaLogo from '@/assets/amana-logo.png';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream animate-fade-out" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="animate-pulse">
        <img 
          src={amanaLogo} 
          alt="Amana" 
          className="h-16 w-auto opacity-80"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
