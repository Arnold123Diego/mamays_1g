import React, { useState } from "react";
import Header from "./components/Header/Header";
import "./app.scss";
import Footer from "./components/Footer/Footer";
import AccContainer from "./components/AccContainer/AccContainer";
import CTA from "./components/CTA/CTA";
import DishFeed from "./components/DishFeed/DishFeed";
import UserProfile from "./components/UserProfile/UserProfile";
import PublishDish from "./components/PublishDish/PublishDish";
import MyDiners from "./components/MyDiners/MyDiners";
import MyMamays from "./components/MyMamays/MyMamays";
import AuthForm from "./components/AuthForm/AuthForm";
import DishDetail from "./components/DishDetail/DishDetail";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [view, setView] = useState('home');
  const [selectedDish, setSelectedDish] = useState(null);

  const handleClearSession = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
    setView('dish-detail');
  };

  return (
    <div className="App">
      <Header 
        onProfileClick={() => setView('profile')} 
        onHomeClick={() => setView('home')} 
        onPublishClick={() => setView('publish-dish')}
        onDinersClick={() => setView('diners')}
        onLogout={handleClearSession}
        onLoginClick={() => setView('login')}
        currentView={view}
        user={user}
      />
      
      {view === 'home' && (
        <>
          <DishFeed onDishClick={handleDishClick} />
          <CTA />
          <AccContainer />
        </>
      )}

      {view === 'login' && (
        <div style={{ backgroundColor: '#e83a3a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <AuthForm onAuthSuccess={(userData) => { setUser(userData); setView('home'); }} />
        </div>
      )}

      {view === 'profile' && user && (
        <UserProfile userRole={user.rol} onBack={() => setView('home')} onClearRole={handleClearSession} />
      )}

      {view === 'publish-dish' && user && (
        <PublishDish onBack={() => setView('home')} />
      )}

      {view === 'diners' && user && (
        user.rol === 'cook' ? <MyDiners onBack={() => setView('home')} /> : <MyMamays onBack={() => setView('home')} />
      )}

      {view === 'dish-detail' && selectedDish && (
        <DishDetail dish={selectedDish} onBack={() => setView('home')} />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
