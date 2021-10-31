import React from 'react';
import Footer from '../footer/footer';
import Card from '../dashboard/card';

import SMB from '@/public/assets/SMB.png';

function Index() {
    return (
        <div>
            <div className="container grid gap-9 grid-cols-4 auto-rows-80">
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
            </div>
            <Footer />
        </div>
    );
}

export default Index;
