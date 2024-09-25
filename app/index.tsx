// index.tsx or App.tsx

import React from 'react';
import { SafeAreaView } from 'react-native';
import FetchUserData from '../componentes/FetchUserData';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FetchUserData />
    </SafeAreaView>
  );
};

export default App;
