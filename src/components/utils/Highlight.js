import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import { Text } from "components/text";

Prism.manual = true;

export function Highlight({ children, block = false }) {
    const codeHighlighted = Prism.highlight(children, Prism.languages.jsx, "jsx");
    const codeBlock = (
        <Text
            variant="code"
            block={block}
            className="language-jsx"
            dangerouslySetInnerHTML={{ __html: codeHighlighted }}
        />
    );

    if (block) {
        return (
            <pre>
                {codeBlock}
            </pre>
        );
    }

    return codeBlock;
}
