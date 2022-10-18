// Daniel Jones - SFTS - 2022

// Since we can't bundle the extension with the powershell script, we have to improvise, adapt, and overcome
// This means we let the extension create the powershell script on the fly...:)
const scriptText =
`$projectpath = $args[0]
$projectname = $args[1]
Set-Location -Path $projectpath
dotnet new sln --name $projectname -o $projectpath 
dotnet new classlib --name $projectname -o $projectpath 
$csproj = "$($projectpath)\\$($projectname).csproj"
dotnet sln add $csproj
$csproj_write = @"
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net4.7.2</TargetFramework>
  </PropertyGroup>

  <PropertyGroup>
    <Company>Swiss FTS AG</Company>
    <AssemblyTitle>$($projectname)</AssemblyTitle>
    <Copyright>Copyright SFTS ${new Date().getFullYear()}</Copyright>
  </PropertyGroup>

  <ItemGroup>
    <Reference Include="kCura.EventHandler">
      <HintPath>C:\\Program Files\\kCura Corporation\\Relativity SDK\\Event Handlers\\Client\\kCura.EventHandler.dll</HintPath>
    </Reference>
  </ItemGroup>

</Project>
"@
$csproj_write | Out-File -FilePath $csproj`;

export { scriptText };