import type { ReactNode } from 'react';

import './styles.css';

type ApplicationFrameProps = {
    children: ReactNode;
};

const ApplicationFrame: React.FC<ApplicationFrameProps> = ({ children }) => {
    return (
        <div className="application-frame-container">
            {/* <Header /> */}
            {children}
        </div>
    );
};

export default ApplicationFrame;
