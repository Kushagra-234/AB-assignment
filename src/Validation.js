import moment from "moment";
import { Tag } from "antd";

// date picker
export const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

export const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment()?.endOf('day');
};

export const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
});


// tags picker 
export const tagRender = (props) => {
    const { label, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <Tag
            // color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{
                marginRight: 3,
                textTransform: "capitalize"
            }}
        >
            {label}
        </Tag>
    );
};

