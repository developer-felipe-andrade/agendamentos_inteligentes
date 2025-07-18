import { useEffect } from 'react';
import user from '../../api/requests/user';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../../components/AlertContext.jsx";
import Scaffold from '../../components/Scaffold';

export default function Home() {
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchData() {
      try {
        await user.me();
      } catch {
        addAlert("Usuário não contectado", "error");
        navigate('/login');
      }
    }
    fetchData();
  }, []);

  return (
    <Scaffold>
      <div/>
    </Scaffold>
  );
}
