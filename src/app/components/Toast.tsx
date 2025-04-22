interface ToastProps {
    toast: { message: string; type: 'success' | 'error' } | null;
  }
  
  export default function Toast({ toast }: ToastProps) {
    if (!toast) return null;
  
    return (
      <div
        className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg text-white animate-fade-in ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        {toast.message}
      </div>
    );
  }