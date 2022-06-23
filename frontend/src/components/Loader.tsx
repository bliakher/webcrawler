import Spinner from 'react-bootstrap/Spinner';

export const Loader = () => {
    return (
        <div className="text-center justify-content-md-center m-2">
            <Spinner animation="grow" size="sm" role="status"/> Načítá se...
        </div>);
}