import React, { useState } from 'react';
import Image from '@/public/assets/image.png';
import { Link } from 'react-router-dom';

interface ResponseItem {
    data: string;
}

function FetchResponse(props: { response: ResponseItem }) {
    return <li>{JSON.stringify(props.response)}</li>;
}

function Index() {
    const [responseList, setResponseList] = useState<JSX.Element[]>([]);

    const onFetchButtonClick = () => {
        fetch('api/get-resource')
            .then(response => response.json())
            .then(data => setResponseList(responseList.concat(<FetchResponse key={responseList.length} response={data} />)));
    };
    return (
        <div className="m-6">
            <h1 className="text-4xl">Hello, World!</h1>
            <p>This is a sample app using React, Tailwind and Django</p>
            <img src={Image} alt="a cool image" width="800px"></img>
            <p>This is a cool image</p>
            <button className="rounded-md bg-green-500 hover:bg-green-600 text-white text-lg p-1" onClick={onFetchButtonClick}>
                Fetch from server
            </button>
            <Link to="/about" className="inline-block rounded-md bg-gray-700 hover:bg-gray-800 text-white text-lg p-1 ml-3">
                About
            </Link>
            <ul>{responseList}</ul>
        </div>
    );
}

export default Index;
