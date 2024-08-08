export const Article = ({
  title,
  content,
  author,
}: {
  title: string;
  content: string;
  author: {
    email: string;
  };
}) => {
  return (
    <div className="border p-4">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      <p className="text-sm font-light mb-2">{author.email}</p>
      <p>{content}</p>
    </div>
  );
};
