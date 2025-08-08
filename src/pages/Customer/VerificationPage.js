import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
axios
  .get(`http://localhost:8080/api/customer/verify`, {
    params: { token }
  })
  .then(res => {
    setMessage(res.data);
    setLoading(false);
  })
  .catch(() => {
    setMessage("Verification failed. Invalid or expired token.");
    setLoading(false);
  });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
    </div>
  );
}