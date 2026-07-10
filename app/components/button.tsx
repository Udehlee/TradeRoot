interface ButtonProps {
  text: string;
  href: string;
}

const Button = ({ text, href }: ButtonProps) => {
  return (
    <Link href={href}>
      {text}
    </Link>
  );
};

export default Button;