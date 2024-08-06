import AppNavigator from '../navigation/index';
import { DbProvider } from '../utils/dbContext';

const Root = () => {
  return (
    <DbProvider>
      <AppNavigator />
    </DbProvider>
  );
};

export default Root;
