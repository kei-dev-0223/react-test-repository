//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./CodeBlock.module.scss";

type CodeBlockProps = {
  children: string;
  className?: string;
  id?: string;
};

function CodeBlock({ children, className, id }: CodeBlockProps) {

  const lines = children.split("\n");

  if (lines.length > 0 && lines[0].trim() === "") lines.shift();
  if (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

  const targetLines = lines.slice(1).filter(line => line.trim() !== "");

  let baseIndent = 0;
  if (targetLines.length > 0) {
    baseIndent = targetLines.reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const count = match ? match[0].length : 0;
      return count < min ? count : min;
    }, Infinity);
  }

  const code = lines
    .map((line, index) => {
      let processedLine = line;
      if (index > 0 && baseIndent !== Infinity && baseIndent > 0) {
        processedLine = line.startsWith(" ".repeat(baseIndent))
          ? line.slice(baseIndent)
          : line.trimStart();
      }
      return processedLine.trimEnd();
    })
    .join("\n");

  return (
    <pre id={id} className={clsx(styles["codeblock"], className)}>
      <code>{code}</code>
    </pre>
  );
}

export default CodeBlock;