import logo from './logo.svg';
import './App.css';
import { useFormik } from 'formik';

function App() {
  const formik = useFormik({
    initialValues: {
      name: 'Karthikeyan'
    }
  }); 
  console.log('Form Values', formik.values);
  return (
    <div className="App">
      <form>
        <label htmlFor='name'>Name</label>
        <input 
        type='text' 
        id='name' 
        name='name' 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
