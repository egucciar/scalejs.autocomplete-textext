param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.autocomplete-textext' : 'Scripts/scalejs.autocomplete-textext-$($package.Version)',
		'textext'						: 'Scripts/textext'
	}" |
	Add-Shims "{ 
		'textext'		: { 
			deps : ['jQuery']
		}
	}" | 
	Add-ScalejsExtension 'scalejs.autocomplete-textext' |
	Out-Null