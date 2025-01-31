import ReactDOM from 'react-dom';
import { Chatroom } from './Chatroom';
import './index.less';

const App = () => <div className='App'>
    <h1>谁是卧底</h1>

    <div>
        <Chatroom />
    </div>
</div>

ReactDOM.render(<App />, document.getElementById('app'));
