import Search from './components/Search';
import { Home } from './components/Home';

function App() {
  return (
      <div className='row'>
        <div className='col-9 horizontal-scrollable'>
          <Home />
          </div>
        <div className='col-3'>
          <Search />
        </div>
      </div>
  );
}

export default App;
