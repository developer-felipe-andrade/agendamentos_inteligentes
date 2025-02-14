import { useEffect } from 'react';
import user from '../../api/requests/user';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/UseAlert';
import Scaffold from '../../components/Scaffold';

export default function Home() {
  const { renderAlerts, addAlert } = Alert();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchData() {
      try {
        await user.me();
      } catch {
        addAlert("Usuário não contectado");
        navigate('/login');
      }
    }
    fetchData();
  }, []);

  return (
    <Scaffold>
      <div>
        {renderAlerts()}
      </div>
    </Scaffold>
  );
}
