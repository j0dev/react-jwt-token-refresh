import React from "react";
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./components/App";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from 'components/store';
import { Provider } from 'react-redux';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware,))
);
const persister = persistStore(store);
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);