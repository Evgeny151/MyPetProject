import { FC, useState } from "react"

export const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div>
            <input
                type='text'
                placeholder='Email'
                onChange={e => setEmail(e.target.value)}
                value={email}
            />
            <input
                type='text'
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
                value={password}
            />
            <button>Login</button>
            <button>Registration</button>
        </div>
    )
}