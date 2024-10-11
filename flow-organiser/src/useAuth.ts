import { useEffect, useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setLoading] = useState(true);

  useEffect(() => {
    let localToken = localStorage.getItem('token');
    if (localToken) {
      localToken = localToken === 'undefined' ? null : localToken;
      setToken(localToken);
    }
    setLoading(false);
  }, []);

  return { token, tokenLoading };
};

export default useAuth;