// src/components/Alerts.jsx
import { useDispatch, useSelector } from 'react-redux';
import { removeAlert } from '../../../JS/action/alertAction';

const Alerts = () => {
  const alerts = useSelector(state => state.alerts);
  const dispatch = useDispatch(); 
  
  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.severity}`}>
          {alert.message}
          <button onClick={() => dispatch(removeAlert(alert.id))}>&times;</button>
        </div>
      ))}
    </div>
  );
};