//% frontend/src/components/ApiTestButton.tsx
//? Bouton de test de l'API

import { useState, useCallback } from 'react';

interface ApiTestButtonProps<T> {
  serviceFn: () => Promise<T>;  // Le service API appelé (getAdherents, etc.)
  label?: string;
  successMsg?: string;
  className?: string;
}

export const ApiTestButton = <T,>({
  serviceFn,
  label = 'Tester API',
  successMsg = 'API OK !',
  className = '',
}: ApiTestButtonProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🚀 Test ${label}...`);
      const data: T = await serviceFn();
      
      console.table(data);
      console.log(`${successMsg} →`, data);
      
      alert(`${successMsg} (${(data as []).length || 1} items)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`Erreur ${label}:`, msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [serviceFn, label, successMsg]);

  return (
    <button 
      onClick={handleTest}
      disabled={loading}
      className={`api-test-btn ${className}`}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {loading ? '⏳ Chargement...' : label}
      {error && (
        <small style={{ color: '#dc3545', display: 'block', fontSize: '12px' }}>
          {error}
        </small>
      )}
    </button>
  );
};