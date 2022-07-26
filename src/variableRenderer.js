const tokenRegx = /{([\s\S]+?)}/g;

const trimBraces = (str) => str.substring(1, str.length - 1);

const replaceTokens = (token, str) => {
    const keys = Object.keys(token)
    return str.replaceAll("{" + keys[0] + "}", token[keys[0]]);
}

const renderStatement = (statement, agent, variables) => {
    const vars = executeVariables(statement, agent, variables);
    let str = statement;
    vars.forEach(e => {
        str = replaceTokens(e, str)
    })
    return str;
};

const executeVariables = (statement, agent, variables) => {
    const tokens = (statement.match(tokenRegx) || []).map(
        (str) => trimBraces(str)
    );

    const executedVariables = tokens
        .map((token) => {
            if (!variables[token]) {
                console.log(`WARNING: Variable ${token} does not exist.`);
                return { [token]: "null" };
            }
            return { [token]: variables[token](agent) };
        })
    return executedVariables;
};

module.exports = { renderStatement }