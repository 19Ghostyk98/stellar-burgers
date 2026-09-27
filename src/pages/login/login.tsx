import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '@services/slices/userSlice';
import { useDispatch } from '@services/store';

type TLocationState = {
  from?: Location;
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError(undefined);
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as TLocationState | null)?.from?.pathname ?? '/';
        void navigate(from, { replace: true });
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
