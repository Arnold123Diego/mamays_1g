import React, { useState, useEffect } from "react";
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
import MyKitchen from "./components/MyKitchen/MyKitchen";
import AuthForm from "./components/AuthForm/AuthForm";
import DishDetail from "./components/DishDetail/DishDetail";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [view, setView] = useState('home');
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishToEdit, setDishToEdit] = useState(null);

  // Efecto para scroll al inicio cada vez que cambia la vista
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleClearSession = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
    setView('dish-detail');
  };

  const handleEditDish = (dish) => {
    setDishToEdit(dish);
    setView('publish-dish');
  };

  const handleAddNewDish = () => {
    setDishToEdit(null);
    setView('publish-dish');
  };

  return (
    <div className="App">
      <Header 
        onProfileClick={() => setView('profile')} 
        onHomeClick={() => setView('home')} 
        onPublishClick={() => setView(user?.rol === 'cook' ? 'my-kitchen' : 'publish-dish')}
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
        <PublishDish onBack={() => setView('my-kitchen')} dishToEdit={dishToEdit} />
      )}

      {view === 'my-kitchen' && user && (
        <MyKitchen onEditDish={handleEditDish} onAddNew={handleAddNewDish} onBack={() => setView('home')} />
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
