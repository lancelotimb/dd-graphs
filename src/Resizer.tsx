import * as React from 'react';

type sizeArray = [number, number];

interface ResizerProps {
    container: HTMLElement;
    children: (size: sizeArray) => React.ReactNode;
}

export const Resizer: React.FunctionComponent<ResizerProps> = ({
    container,
    children,
}) => {
    const [size, setSize] = React.useState<sizeArray>([0, 0]);
    React.useEffect(() => {
        const updateSize = () => {
            setSize([container.clientWidth, container.clientHeight]);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    console.log('re-render');

    return <>{children(size)}</>;
};
