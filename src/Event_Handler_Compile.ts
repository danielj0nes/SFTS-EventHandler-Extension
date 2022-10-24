// Daniel Jones - SFTS - 2022

const compileText =
`$projectpath = $args[0]
Set-Location -Path $projectpath
dotnet build`;

export { compileText };