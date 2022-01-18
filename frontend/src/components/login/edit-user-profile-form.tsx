import React from 'react';

interface EditUserProfileFormProps {
    profileImage: string;
    onSubmit: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditUserProfileForm(props: EditUserProfileFormProps) {
    return (
        <div className="flex flex-col">
            <img
                className="object-cover object-center rounded-full w-full"
                style={{ aspectRatio: '1' }}
                src={props.profileImage}
            ></img>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    props.onSubmit();
                }}
                className="self-stretch relative"
            >
                <input
                    ref={props.inputRef}
                    id="edit-user-name"
                    name="edit-user-name"
                    type="text"
                    value={props.userName}
                    onChange={e => props.setUserName(e.currentTarget.value)}
                    className="appearance-none w-full font-medium text-2xl text-center bg-gray-900 rounded-lg h-9 px-3 mt-2.5 focus:outline-none"
                    style={{ marginBottom: '-0.125rem' }} // Reduce the height of this element by the extra padding created by the input
                ></input>
            </form>
        </div>
    );
}
