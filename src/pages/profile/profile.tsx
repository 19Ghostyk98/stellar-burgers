import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>(undefined);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    Boolean(formValue.password);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError(undefined);
    const payload: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email,
    };
    if (formValue.password) payload.password = formValue.password;

    void dispatch(updateUser(payload))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
