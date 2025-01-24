'use client'
import {useForm} from 'react-hook-form';

const page = () => {
    const form = useForm();

    return (
        <form>
            <input type="text" placeholder="name" />
            <button type="submit">submit</button>
        </form>
    );
};

export default page;