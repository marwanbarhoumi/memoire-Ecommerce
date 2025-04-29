
let nextAlertId = 0;

export const setAlert = (message, severity = 'info', timeout = 5000) => dispatch => {
  const id = nextAlertId++;
  
  dispatch({
    type: 'SET_ALERT',
    payload: { id, message, severity }
  });

  if (timeout > 0) {
    setTimeout(() => dispatch(removeAlert(id)), timeout);
  }
};

export const removeAlert = (id) => ({
  type: 'REMOVE_ALERT',
  payload: id
});