import 'antd';

declare module 'antd' {
    interface AbstractSelectProps {
        onMouseDown?: () => {};
    }
}